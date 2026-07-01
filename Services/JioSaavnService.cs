using System.Text.Json.Nodes;

namespace JioSaavanTrial.Services
{
    public class JioSaavnService
    {
        private readonly HttpClient _httpClient;
        private readonly CryptoService _cryptoService;
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
    }
}
