using JioSaavanTrial.Models;
using System.Text;
using System.Text.Json;

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

        public async Task<ChatResponse> ChatAsync(ChatRequest request)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            var model = _configuration["Gemini:Model"];

            var prompt = $"""
You are Melody AI, an intelligent music recommendation assistant.

Recommend songs that best match the user's music profile and request.

Rules:
- Recommend only officially released songs.
- Do not invent songs or artists.
- Return the original recording unless the user specifically requests a remix, live version, acoustic version, cover, etc.
- Generate searchKeywords that uniquely identify the official song in a music catalog.
- Include the song title, artist and album name in searchKeywords.
- Briefly explain why each song was recommended.

Music Profile:
{JsonSerializer.Serialize(request.MusicProfile)}

User Request:
{request.Message}
""";

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
                Response = aiDocument.RootElement.Clone()
            };
        }
    }
}