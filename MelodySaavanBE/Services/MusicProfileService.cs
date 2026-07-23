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

            var user = await userTask;
            var playHistory = await playHistoryTask;
            var likedSongs = await likedSongsTask;
            var searchHistory = await searchHistoryTask;

            JsonNode? playlists = await playlistsTask;
            JsonNode? followingArtists = await followingArtistsTask;


            var songIds = playHistory
    .Select(x => x.SongId)
    .Concat(likedSongs.Select(x => x.SongId))
    .Where(x => !string.IsNullOrWhiteSpace(x))
    .Distinct()
    .ToList();

            JsonNode? songs = null;

            if (songIds.Any())
            {
                songs = await _jioSaavnService.GetSongAsync(
                    string.Join(",", songIds));
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