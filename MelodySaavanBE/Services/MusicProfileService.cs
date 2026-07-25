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

        public async Task<object> BuildMusicProfileAsync(string jioUserId,string cookies)
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
    .OrderByDescending(x => x.PlayCount)
    .ThenByDescending(x => x.LastPlayedAt)
    .Take(20)
    .Select(x => new
    {
        x.SongId,
        x.PlayCount
        // x.LastPlayedAt
    })
    .ToList();

            //var likedSongs = await likedSongsTask;

            var likedSongs = (await likedSongsTask)
                .Select(x => x.SongId)
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Distinct()
                .ToList();
            //var searchHistory = await searchHistoryTask;

            var searchHistory = (await searchHistoryTask)
                .Select(x => x.Keyword)
                .Where(k => !string.IsNullOrWhiteSpace(k))
                .Distinct()
                .Take(10)
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
            var songIds = playHistory
     .Select(x => x.SongId)
     .Concat(likedSongs)
     .Where(id => !string.IsNullOrWhiteSpace(id))
     .Distinct()
     .ToList();

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

                songIds.AddRange(playlistSongIds ?? []);

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