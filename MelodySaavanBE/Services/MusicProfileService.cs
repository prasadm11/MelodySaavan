using JioSaavanTrial.Repositories;
using System.Text.Json.Nodes;

namespace JioSaavanTrial.Services
{
    public class MusicProfileService
    {
        private readonly PersonalizationRepository _repository;
        private readonly JioSaavnService _jioSaavnService;

        public MusicProfileService(
            PersonalizationRepository repository,
            JioSaavnService jioSaavnService)
        {
            _repository = repository;
            _jioSaavnService = jioSaavnService;
        }

        public async Task<object> BuildMusicProfileAsync(
    string jioUserId,
    string cookies)
        {
            // Database
            var userTask = _repository.GetUserAsync(jioUserId);
            var playHistoryTask = _repository.GetPlayHistoryAsync(jioUserId);
            var likedSongsTask = _repository.GetLikedSongsAsync(jioUserId);
            var searchHistoryTask = _repository.GetSearchHistoryAsync(jioUserId);

            // JioSaavn
            var playlistsTask = _jioSaavnService.GetPlaylistsAsync(cookies);
            var followingArtistsTask =
                _jioSaavnService.GetFollowingArtistsAsync(jioUserId, cookies);

            await Task.WhenAll(
                userTask,
                playHistoryTask,
                likedSongsTask,
                searchHistoryTask,
                playlistsTask,
                followingArtistsTask);

            //var user = await userTask;
            var dbUser = await userTask;

            var user = dbUser == null
                ? null
                : new
                {
                    FirstName = dbUser.FirstName
                };
            //var playHistory = await playHistoryTask;

            var playHistory = (await playHistoryTask)
                .Select(x => new
                {
                    x.SongId,
                    x.PlayCount
                    // Uncomment if you decide to use recency
                    // x.LastPlayedAt
                })
                .ToList();

            //var likedSongs = await likedSongsTask;

            var likedSongs = (await likedSongsTask)
                .Select(x => new
                {
                    x.SongId
                    // Uncomment if you want recency-based recommendations
                    // x.LikedAt
                })
                .ToList();
            //var searchHistory = await searchHistoryTask;

            var searchHistory = (await searchHistoryTask)
                .Select(x => x.Keyword)
                .Distinct()
                .ToList();

            //JsonNode? playlists = await playlistsTask;

            //var playlists = (await playlistsTask)?
            //    .AsArray()
            //        .Select(x => new
            //        {
            //            Id = x?["id"]?.ToString(),
            //            Title = x?["title"]?.ToString()
            //        })
            //    .Where(x => !string.IsNullOrWhiteSpace(x))
            //    .Distinct()
            //    .ToList();

            var playlists = new List<object>();

            foreach (var playlist in (await playlistsTask)?.AsArray() ?? [])
            {
                var playlistId = playlist?["id"]?.ToString();
                var title = playlist?["title"]?.ToString();

                if (string.IsNullOrWhiteSpace(playlistId))
                    continue;

                var playlistDetails = await _jioSaavnService.GetPlaylistAsync(playlistId);

                var playlistSongIds = playlistDetails?["list"]?
                    .AsArray()
                    .Select(s => s?["id"]?.ToString())
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .ToList();

                playlists.Add(new
                {
                    Id = playlistId,
                    Title = title,
                    SongIds = playlistSongIds
                });
            }
            //JsonNode? followingArtists = await followingArtistsTask;

            JsonNode? followingArtistsNode = await followingArtistsTask;

            var followingArtists = followingArtistsNode?["follow"]?
                .AsArray()
                .Select(x => x?["details"]?["name"]?.ToString())
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToList();




            var songIds = playHistory
     .Select(x => x.SongId)
     .Concat(likedSongs.Select(x => x.SongId))
     .Where(id => !string.IsNullOrWhiteSpace(id))
     .Distinct()
     .ToList();

            List<object>? songs = null;

            if (songIds.Any())
            {
                var songsResponse = await _jioSaavnService.GetSongAsync(
                    string.Join(",", songIds));

                songs = songsResponse?["songs"]?
                    .AsArray()
                    .Select(song => (object)new
                    {
                        Id = song?["id"]?.ToString(),
                        Title = song?["title"]?.ToString(),
                        Artists = song?["more_info"]?["artistMap"]?["primary_artists"]?
                            .AsArray()
                            .Select(a => a?["name"]?.ToString())
                            .Where(name => !string.IsNullOrWhiteSpace(name))
                            .ToList(),
                        Album = song?["more_info"]?["album"]?.ToString(),
                        Language = song?["language"]?.ToString(),
                        Year = song?["year"]?.ToString()
                    })
                    .ToList();
            }

            return new
            {
                User = user,
                PlayHistory = playHistory,
                LikedSongs = likedSongs,
                SearchHistory = searchHistory,
                Playlists = playlists,
                FollowingArtists = followingArtists,
                Songs = songs,
                GeneratedAt = DateTime.UtcNow
            };
        }

    }
}