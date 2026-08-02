using JioSaavanTrial.Models;
using System.Text;
using System.Text.Json;
using JioSaavanTrial.Enums;

namespace JioSaavanTrial.Services
{
    public class GeminiService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        private static readonly object PlaylistResponseSchema = new
        {
            type = "OBJECT",
            properties = new
            {
                title = new { type = "STRING" },
                description = new { type = "STRING" },
                songs = new
                {
                    type = "ARRAY",
                    items = new
                    {
                        type = "OBJECT",
                        properties = new
                        {
                            title = new { type = "STRING" },
                            artist = new { type = "STRING" },
                            album = new { type = "STRING" },
                            year = new { type = "INTEGER" },
                            language = new { type = "STRING" },
                            searchKeywords = new { type = "STRING" },
                            reason = new { type = "STRING" }
                        },
                        required = new[]
                        {
                            "title",
                            "artist",
                            "album",
                            "year",
                            "language",
                            "searchKeywords",
                            "reason"
                        }
                    }
                }
            },
            required = new[]
            {
                "title",
                "description",
                "songs"
            }
        };

        public GeminiService(IConfiguration configuration, HttpClient httpClient)
        {
            _configuration = configuration;
            _httpClient = httpClient;
        }
        
        private async Task<AIIntent> DetectIntentAsync(string message)
        {
            var prompt = $"""
                          You are an intent classifier.

                          Your job is to classify the user's message.

                          Possible intents:

                          CHAT
                          MUSIC

                          Examples

                          User:
                          How are you?

                          CHAT

                          --------------------

                          User:
                          Recommend romantic songs

                          MUSIC

                          --------------------

                          User:
                          Tell me a joke

                          CHAT

                          --------------------

                          User:
                          Songs similar to Arijit Singh

                          MUSIC

                          --------------------

                          User:
                          I'm feeling lonely tonight

                          MUSIC

                          --------------------

                          User:
                          Explain ASP.NET Core

                          CHAT

                          Respond ONLY with

                          CHAT

                          or

                          MUSIC

                          User:
                          {message}
                          """;

            var response = await GenerateTextAsync(prompt);

            return response.Trim().Equals("MUSIC",
                StringComparison.OrdinalIgnoreCase)
                ? AIIntent.Music
                : AIIntent.Chat;
        }
        
        private async Task<ChatResponse> HandleChatAsync(ChatRequest request)
        {
            var prompt = $"""
                          You are Melody AI.

                          You are a friendly AI assistant inside MelodySaavan.

                          Answer naturally.

                          Do not recommend songs unless the user specifically asks for music.

                          User:

                          {request.Message}
                          """;

            var response = await GenerateTextAsync(prompt);

            return new ChatResponse
            {
                Type = "chat",
                Success = true,
                Timestamp = DateTime.UtcNow,
                Data = JsonDocument.Parse(
                        JsonSerializer.Serialize(new
                        {
                            message = response
                        }))
                    .RootElement
                    .Clone()
            };
        }
        
        private async Task<ChatResponse> HandleMusicRecommendationAsync(ChatRequest request)
        {
            var prompt = $"""
                          You are Melody AI.

                          Recommend songs that match the user's request.

                          Use the Music Profile.

                          Rules

                          - Recommend only officially released songs.
                          - Never invent songs.
                          - Return original recordings.
                          - Generate searchKeywords.
                          - Explain every recommendation.

                          Music Profile

                          {JsonSerializer.Serialize(request.MusicProfile)}

                          User Request

                          {request.Message}
                          """;

            return await GenerateStructuredResponseAsync(prompt);
        }
        
        
       private async Task<string> GenerateTextAsync(string prompt)
{
    var apiKey = _configuration["Gemini:ApiKey"];
    var model = _configuration["Gemini:Model"];

    var body = new
    {
        contents = new[]
        {
            new
            {
                parts = new[]
                {
                    new
                    {
                        text = prompt
                    }
                }
            }
        }
    };

    var json = JsonSerializer.Serialize(body);

    using var content = new StringContent(
        json,
        Encoding.UTF8,
        "application/json");

    var response = await _httpClient.PostAsync(
        $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}",
        content);

    var responseJson = await response.Content.ReadAsStringAsync();

    // Log the raw Gemini response
    Console.WriteLine("===== Gemini Response =====");
    Console.WriteLine(responseJson);
    Console.WriteLine("===========================");

    if (!response.IsSuccessStatusCode)
    {
        throw new Exception($"Gemini API Error: {response.StatusCode}\n{responseJson}");
    }

    using var document = JsonDocument.Parse(responseJson);

    if (!document.RootElement.TryGetProperty("candidates", out var candidates) ||
        candidates.GetArrayLength() == 0)
    {
        throw new Exception($"Gemini returned no candidates.\nResponse:\n{responseJson}");
    }

    var candidate = candidates[0];

    if (!candidate.TryGetProperty("content", out var contentElement))
    {
        throw new Exception($"Gemini response has no content.\nResponse:\n{responseJson}");
    }

    if (!contentElement.TryGetProperty("parts", out var parts) ||
        parts.GetArrayLength() == 0)
    {
        throw new Exception($"Gemini response has no parts.\nResponse:\n{responseJson}");
    }

    var text = parts[0].GetProperty("text").GetString();

    if (string.IsNullOrWhiteSpace(text))
    {
        throw new Exception($"Gemini returned empty text.\nResponse:\n{responseJson}");
    }

    return text.Trim();
}
       
        private async Task<ChatResponse> GenerateStructuredResponseAsync(string prompt)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var model = _configuration["Gemini:Model"];

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                },

                generationConfig = new
                {
                    responseMimeType = "application/json",
                    responseSchema = PlaylistResponseSchema
                }
            };

            var json = JsonSerializer.Serialize(requestBody);

            using var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}",
                content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API Error: {error}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            using var document = JsonDocument.Parse(responseJson);

            if (!document.RootElement.TryGetProperty("candidates", out var candidates) ||
                candidates.GetArrayLength() == 0)
            {
                throw new Exception("Gemini returned no candidates.");
            }

            var aiResponse = candidates[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(aiResponse))
            {
                throw new Exception("Gemini returned an empty response.");
            }

            using var aiDocument = JsonDocument.Parse(aiResponse);

            return new ChatResponse
            {
                Type = "music",
                Success = true,
                Timestamp = DateTime.UtcNow,
                Data = aiDocument.RootElement.Clone()
            };
        }
        
        public async Task<ChatResponse> ChatAsync(ChatRequest request)
        {
            var intent = await DetectIntentAsync(request.Message);

            return intent switch
            {
                AIIntent.Chat =>
                    await HandleChatAsync(request),

                AIIntent.Music =>
                    await HandleMusicRecommendationAsync(request),

                _ =>
                    await HandleChatAsync(request)
            };
        }

      }
}