using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace JioSaavanTrial.Services
{
    public class JioSaavnService
    {
        private readonly HttpClient _httpClient;
        private readonly CryptoService _cryptoService;
        private CookieContainer? _cookieContainer;
        private HttpClient? _authenticatedClient;
        public JioSaavnService(HttpClient httpClient,CryptoService cryptoService)
        {
            _httpClient = httpClient;
            _cryptoService = cryptoService;
        }

        public async Task<JsonNode?> SearchSongsAsync(string query)
        {
            var url =
                $"?__call=search.getResults" +
                $"&q={Uri.EscapeDataString(query)}" +
                $"&p=1" +
                $"&n=20" +
                $"&ctx=web6dot0" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0";

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            if (json?["results"] is JsonArray songs)
            {
                foreach (var song in songs)
                {
                    var encryptedUrl = song?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        var mediaUrl = _cryptoService.DecryptUrl(encryptedUrl);

                        song!["more_info"]!["media_url"] = mediaUrl;
                    }
                }
            }

            return json;
        }


        public async Task<JsonNode?> GetSongAsync(string songId)
        {
            var url =
                $"?__call=song.getDetails" +
                $"&pids={songId}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            if (json?["songs"] is JsonArray songs)
            {
                foreach (var song in songs)
                {
                    var encryptedUrl = song?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        var mediaUrl = _cryptoService.DecryptUrl(encryptedUrl);

                        song!["more_info"]!["media_url"] = mediaUrl;
                    }
                }
            }

            return json;
        }

        public async Task<JsonNode?> GetNewReleasesAsync()
        {
            var url =
                "?__call=content.getAlbums" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&n=50" +
                "&p=1" +
                "&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            if (json is JsonArray items)
            {
                foreach (var item in items)
                {
                    var encryptedUrl = item?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        item!["more_info"]!["media_url"] =
                            _cryptoService.DecryptUrl(encryptedUrl);
                    }
                }
            }

            return json;
        }

        public async Task<JsonNode?> GetTopChartsAsync()
        {
            var url =
                "?__call=content.getCharts" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetFeaturedPlaylistsAsync()
        {
            var url =
                "?__call=content.getFeaturedPlaylists" +
                "&fetch_from_serialized_files=true" +
                "&p=1" +
                "&n=50" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetTopArtistsAsync()
        {
            var url =
                "?__call=social.getTopArtists" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetArtistAsync(string token)
        {
            var url =
                $"?__call=webapi.get" +
                $"&token={Uri.EscapeDataString(token)}" +
                $"&type=artist" +
                $"&p=0" +
                $"&n_song=50" +
                $"&n_album=50" +
                $"&sub_type=" +
                $"&category=" +
                $"&sort_order=" +
                $"&includeMetaTags=0" +
                $"&ctx=web6dot0" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0";

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            // Decrypt media_url for artist's top songs
            if (json?["topSongs"] is JsonArray songs)
            {
                foreach (var song in songs)
                {
                    var encryptedUrl = song?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        song!["more_info"]!["media_url"] =
                            _cryptoService.DecryptUrl(encryptedUrl);
                    }
                }
            }

            return json;
        }
        public async Task<JsonNode?> GetPlaylistAsync(string playlistId)
        {
            var url =
                $"?__call=playlist.getDetails" +
                $"&listid={playlistId}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            if (json?["list"] is JsonArray songs)
            {
                foreach (var song in songs)
                {
                    var encryptedUrl = song?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        song!["more_info"]!["media_url"] =
                            _cryptoService.DecryptUrl(encryptedUrl);
                    }
                }
            }

            return json;
        }

        public async Task<JsonNode?> GetLyricsAsync(string lyricsId)
        {
            var url =
                $"?__call=lyrics.getLyrics" +
                $"&lyrics_id={lyricsId}" +
                $"&ctx=web6dot0" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetTopSearchesAsync()
        {
            var url =
                "?__call=content.getTopSearches" +
                "&ctx=web6dot0" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }


        public async Task<JsonNode?> GetAlbumAsync(string token)
        {
            var url =
                $"?__call=webapi.get" +
                $"&token={Uri.EscapeDataString(token)}" +
                $"&type=album" +
                $"&includeMetaTags=0" +
                $"&ctx=web6dot0" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }


        public async Task<JsonNode?> GetHomeAsync()
        {
            var url =
                "?__call=webapi.getLaunchData" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&ctx=web6dot0";

            var response = await _httpClient.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> SendOtpAsync(
    string phoneNumber)
        {
            var payload = new
            {
                phone_number = phoneNumber,
                //recaptcha_response = recaptchaResponse
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            using var client = new HttpClient();

            var response = await client.PostAsync(
                "https://api1.jiosaavn.com/jio/sendOtp?__call=jio/sendOtp&api_version=4&_format=json&_marker=0&ctx=web6dot0",
                content);

            var json = await response.Content.ReadAsStringAsync();

            return JsonNode.Parse(json);
        }

        public async Task<JsonNode?> VerifyOtpAsync(
            string phoneNumber,
            string otp,
            string correlationId)
        {
            var cookieContainer = new CookieContainer();

            var handler = new HttpClientHandler
            {
                CookieContainer = cookieContainer,
                UseCookies = true
            };

            _authenticatedClient = new HttpClient(handler);

            _authenticatedClient.BaseAddress =
                new Uri("https://www.jiosaavn.com/api.php");

            var payload = new
            {
                phone_number = phoneNumber,
                otp = otp,
                correlation_id = correlationId
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json");

            var response = await _authenticatedClient.PostAsync(
                "https://api1.jiosaavn.com/user/jioOtpLogin?__call=user/jioOtpLogin&api_version=4&_format=json&_marker=0&ctx=web6dot0",
                content);

            var json = await response.Content.ReadAsStringAsync();

            var result = JsonNode.Parse(json);

            // Capture cookies
            var wwwCookies = cookieContainer.GetCookies(
                new Uri("https://www.jiosaavn.com"));

            var apiCookies = cookieContainer.GetCookies(
                new Uri("https://api1.jiosaavn.com"));

            var cookieArray = new JsonArray();

            var added = new HashSet<string>();
            var cookieHeaderParts = new List<string>();

            foreach (Cookie cookie in wwwCookies)
            {
                cookieArray.Add(new JsonObject
                {
                    ["Name"] = cookie.Name,
                    ["Value"] = cookie.Value,
                    ["Domain"] = cookie.Domain,
                    ["Path"] = cookie.Path
                });

                if (added.Add(cookie.Name))
                    cookieHeaderParts.Add($"{cookie.Name}={cookie.Value}");
            }

            foreach (Cookie cookie in apiCookies)
            {
                cookieArray.Add(new JsonObject
                {
                    ["Name"] = cookie.Name,
                    ["Value"] = cookie.Value,
                    ["Domain"] = cookie.Domain,
                    ["Path"] = cookie.Path
                });

                if (added.Add(cookie.Name))
                    cookieHeaderParts.Add($"{cookie.Name}={cookie.Value}");
            }

            // Build a copy-paste cookie string
            var cookieHeader = string.Join("; ", cookieHeaderParts);

            result!["CookieHeader"] = cookieHeader;
            result["CapturedCookies"] = cookieArray;

            return result;
        }


        public async Task<JsonNode?> CreatePlaylistAsync(string listName, string cookies, bool share = true)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=playlist.create" +
                $"&listname={Uri.EscapeDataString(listName)}" +
                $"&contents=" +
                $"&share={share.ToString().ToLower()}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }


        public async Task<JsonNode?> GetPlaylistsAsync(string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=playlist.list" +
                $"&all_playlists=true" +
                $"&contents=1" +
                $"&onlypids=true" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }


        public async Task<JsonNode?> AddSongToPlaylistAsync(
           string playlistId,
           string songId,
           string language,
           string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var contents = $"~~{songId}~{language}";

            var url =
                $"?__call=playlist.add" +
                $"&listid={Uri.EscapeDataString(playlistId)}" +
                $"&contents={Uri.EscapeDataString(contents)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        private HttpClient CreateAuthenticatedClient(string cookieHeader)
        {
            var container = new CookieContainer();

            foreach (var part in cookieHeader.Split(';'))
            {
                var kv = part.Split('=', 2);

                if (kv.Length == 2)
                {
                    container.Add(
                        new Uri("https://www.jiosaavn.com"),
                        new Cookie(
                            kv[0].Trim(),
                            kv[1].Trim()));
                }
            }

            var handler = new HttpClientHandler
            {
                CookieContainer = container,
                UseCookies = true
            };

            return new HttpClient(handler)
            {
                BaseAddress = new Uri("https://www.jiosaavn.com/api.php")
            };
        }

        public async Task<JsonNode?> AddFavoriteAsync(string songId,string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=library.add" +
                $"&entity_ids={Uri.EscapeDataString(songId)}" +
                $"&entity_type=song" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> RemoveFavoriteAsync(string songId,string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=library.delete" +
                $"&entity_ids={Uri.EscapeDataString(songId)}" +
                $"&entity_type=song" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetListeningHistoryAsync(
    string cookies,
    int size = 40)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=content.getListeningHistory" +
                $"&page=" +
                $"&size={size}" +
                $"&api_version=4" +
                $"&ctx=web6dot0" +
                $"&_format=json" +
                $"&_marker=0";

            var response = await client.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            if (json?["results"] is JsonArray songs)
            {
                foreach (var song in songs)
                {
                    var encryptedUrl =
                        song?["media"]?["more_info"]?["encrypted_media_url"]?.ToString();

                    if (!string.IsNullOrEmpty(encryptedUrl))
                    {
                        song!["media"]!["more_info"]!["media_url"] =
                            _cryptoService.DecryptUrl(encryptedUrl);
                    }
                }
            }

            return json;
        }


        public async Task<JsonNode?> RenamePlaylistAsync(
    string playlistId,
    string playlistName,
    string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=playlist.rename" +
                $"&listid={Uri.EscapeDataString(playlistId)}" +
                $"&listname={Uri.EscapeDataString(playlistName)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> DeletePlaylistAsync(
    string playlistId,
    string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=playlist.delete" +
                $"&listid={Uri.EscapeDataString(playlistId)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<string> GetLibraryAsync(string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                "?__call=library.getAll" +
                "&api_version=4" +
                "&_format=json" +
                "&_marker=0" +
                "&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return response;
        }
    }
}
