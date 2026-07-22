using JioSaavanTrial.Enums;
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

        public async Task<JsonNode?> SearchAsync(
    string query,
    SearchType type = SearchType.Songs,
    int page = 1,
    int limit = 20)
        {
            string apiCall = type switch
            {
                SearchType.Songs => "search.getResults",
                SearchType.Albums => "search.getAlbumResults",
                SearchType.Artists => "search.getArtistResults",
                SearchType.Playlists => "search.getPlaylistResults",
                SearchType.Podcasts => "search.getMoreResults",
                _ => "search.getResults"
            };

            var url =
                $"?__call={apiCall}" +
                $"&q={Uri.EscapeDataString(query)}" +
                $"&p={page}" +
                $"&n={limit}" +
                $"&ctx=web6dot0" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0";

            if (type == SearchType.Podcasts)
            {
                url +=
                    $"&params={Uri.EscapeDataString("{\"type\":\"podcasts\"}")}" +
                    $"&query={Uri.EscapeDataString(query)}";
            }

            var response = await _httpClient.GetStringAsync(url);

            JsonNode? json = JsonNode.Parse(response);

            // Only Songs contain encrypted_media_url
            if (type == SearchType.Songs &&
                json?["results"] is JsonArray songs)
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

        public async Task<JsonNode?> GetLibraryDetailsAsync(
    string entityType,
    string entityIds,
    string cookies)
        {
            var url =
                $"?__call=library.getDetails" +
                $"&entity_ids={Uri.EscapeDataString(entityIds)}" +
                $"&entity_type={Uri.EscapeDataString(entityType)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0" +
                $"&n=50";

            var client = CreateAuthenticatedClient(cookies);

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> FollowArtistAsync(
    string artistId,
    string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=social.follow" +
                $"&type=artist" +
                $"&entity_id={Uri.EscapeDataString(artistId)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> GetFollowingArtistsAsync(
    string uid,
    string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=social.getFollowingDetails" +
                $"&type=artist" +
                $"&uid={Uri.EscapeDataString(uid)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<JsonNode?> UnfollowArtistAsync(
    string artistId,
    string cookies)
        {
            var client = CreateAuthenticatedClient(cookies);

            var url =
                $"?__call=social.unfollow" +
                $"&type=artist" +
                $"&entity_id={Uri.EscapeDataString(artistId)}" +
                $"&api_version=4" +
                $"&_format=json" +
                $"&_marker=0" +
                $"&ctx=web6dot0";

            var response = await client.GetStringAsync(url);

            return JsonNode.Parse(response);
        }

        public async Task<string> ReportPlaybackEventAsync(
    string eventName,
    string songId,
    string songName,
    string cookies,
    long? startTime = null,
    int? totalPlayTime = null,
    int? endPosition = null,
    string? pauseReason = null)
        {
            try
            {
                var client = CreateAuthenticatedClient(cookies);

                var ts = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

                var payload = new Dictionary<string, object?>
                {
                    ["ev"] = eventName,

                    ["bot_src"] = new
                    {
                        screen_name = "home_screen",
                        entity_name = songName,
                        entity_id = songId,
                        entity_type = "song",
                        entity_pos = "0",
                        sec_title = "NULL",
                        sec_id = "NULL",
                        sec_type = "NULL",
                        sec_pos = "NULL",
                        stream_entity_name = "NULL",
                        stream_entity_type = "NULL",
                        stream_entity_id = "NULL",
                        stream_entity_pos = "NULL",
                        screen_page_id = "NULL"
                    },

                    ["top_src"] = new
                    {
                        screen_name = "NULL",
                        sec_title = "NULL",
                        sec_id = "NULL",
                        sec_type = "NULL",
                        sec_pos = "NULL",
                        entity_name = "NULL",
                        entity_id = "NULL",
                        entity_type = "NULL",
                        entity_pos = "NULL"
                    },

                    ["mid_src"] = new
                    {
                        screen_name = ""
                    },

                    ["bitrate"] = "128",
                    ["songid"] = songId,
                    ["ts"] = ts.ToString(),

                    ["cc"] = "IN",
                    ["ctx"] = "web6dot0",
                    ["language"] = "hindi",
                    ["app_language"] = "NULL",
                    ["mobile_network"] = "NULL",
                    ["network_type"] = "4g",
                    ["login_mode"] = "Web",
                    ["app_version"] = "6.0",
                    ["tz"] = "Asia/Calcutta",
                    ["login_state"] = true,
                    ["promode"] = "expired"
                };


                switch (eventName)
                {
                    case "site:player:mediastarted":
                        payload["time_of_addition"] = ts;
                        break;

                    case "site:player:mediaopened":
                        payload["load_time"] = 500;
                        break;

                    case "site:player:progress:30":
                        break;

                    case "site:player:mediastreamed":
                        payload["event_params"] = JsonSerializer.Serialize(new
                        {
                            songid = songId,
                            initial_buffer_time = 0,
                            total_buffer_time = 0,
                            total_playtime = totalPlayTime ?? 30000,
                            start_time = startTime ?? ts,
                            end_pos = endPosition ?? 30
                        });
                        break;

                    case "site:player:mediapaused":
                        payload["event_params"] = JsonSerializer.Serialize(new
                        {
                            songid = songId,
                            initial_buffer_time = 0,
                            total_buffer_time = 0,
                            total_playtime = totalPlayTime ?? 0,
                            start_time = startTime ?? ts,
                            end_pos = endPosition ?? 0,
                            pause_reason = pauseReason ?? "manual"
                        });
                        break;

                    case "site:player:mediaresumed":
                        break;

                    case "site:player:mediaunload":
                        payload["event_params"] = JsonSerializer.Serialize(new
                        {
                            songid = songId,
                            initial_buffer_time = 0,
                            total_buffer_time = 0,
                            total_playtime = totalPlayTime ?? 0,
                            start_time = startTime ?? ts,
                            end_pos = endPosition ?? 0
                        });
                        break;

                    case "site:player:mediaend":
                        break;

                    case "site:player:play_next":
                        break;

                    default:
                        return "Unsupported event";
                }

                var qsp = JsonSerializer.Serialize(new[] { payload });

                Console.WriteLine("===== REPORT PLAYBACK =====");
                Console.WriteLine($"Event: {eventName}");
                Console.WriteLine(qsp);

                var form = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("qsp", qsp)
        });

                var response = await client.PostAsync(
                    "https://stats.jiosaavn.com/stats.php",
                    form);
                Console.WriteLine($"Status: {(int)response.StatusCode} ({response.StatusCode})");

                var body = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"Response: {body}");
               

                return body;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}
