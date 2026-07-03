using JioSaavanTrial.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace JioSaavanTrial.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly JioSaavnService _jioSaavnService;

        public SongController(JioSaavnService jioSaavnService)
        {
            _jioSaavnService = jioSaavnService;
        }

        //returns all the list of song with refrence to query
        [HttpGet]
        public async Task<IActionResult> SearchByQuery(string query)
        {
            var result =await _jioSaavnService.SearchSongsAsync(query);
            return Ok(result);
        }

        //get a particular song
        [HttpGet]
        public async Task<IActionResult> GetById(string songId)
        {
            var result = await _jioSaavnService.GetSongAsync(songId);

            return Ok(result);
        }

        //Get new release album
        [HttpGet]
        public async Task<IActionResult> NewReleases()
        {
            var result = await _jioSaavnService.GetNewReleasesAsync();
            return Ok(result);
        }

        //Top Charts

        [HttpGet]
        public async Task<IActionResult> TopCharts()
        {
            var result = await _jioSaavnService.GetTopChartsAsync();

            return Ok(result);
        }


        //featured playlist
        [HttpGet]
        public async Task<IActionResult> FeaturedPlaylists()
        {
            var result = await _jioSaavnService.GetFeaturedPlaylistsAsync();

            return Ok(result);
        }

        //Top Artist
        [HttpGet]
        public async Task<IActionResult> TopArtists()
        {
            var result = await _jioSaavnService.GetTopArtistsAsync();

            return Ok(result);
        }

        //Get Particular Artist
        [HttpGet]
        public async Task<IActionResult> GetArtist(string token)
        {
            var result = await _jioSaavnService.GetArtistAsync(token);

            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPlaylist(string playlistId)
        {
            var result = await _jioSaavnService.GetPlaylistAsync(playlistId);
            return Ok(result);
        }

        // Get Lyrics
        [HttpGet]
        public async Task<IActionResult> GetLyrics(string lyricsId)
        {
            var result = await _jioSaavnService.GetLyricsAsync(lyricsId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> TopSearches()
        {
            var result = await _jioSaavnService.GetTopSearchesAsync();
            return Ok(result);
        }


        // Album Recommendations
        [HttpGet]
        public async Task<IActionResult> GetAlbum(string token)
        {
            var result = await _jioSaavnService.GetAlbumAsync(token);

            return Ok(result);
        }


        [HttpGet]
        public async Task<IActionResult> GetHome()
        {
            var result = await _jioSaavnService.GetHomeAsync();
            return Ok(result);
        }

        //Send OTP
        [HttpPost]
        public async Task<IActionResult> SendOtp(
            string phoneNumber,
            string recaptchaResponse)
        {
            var result = await _jioSaavnService.SendOtpAsync(
                phoneNumber,
                recaptchaResponse);

            return Ok(result);
        }

        //Verify OTP
        [HttpPost]
        public async Task<IActionResult> VerifyOtp(
            string phoneNumber,
            string otp,
            string correlationId)
        {
            var result = await _jioSaavnService.VerifyOtpAsync(
                phoneNumber,
                otp,
                correlationId);

            return Ok(result);
        }


        // Create Playlist
        [HttpPost]
        public async Task<IActionResult> CreatePlaylist(
            string listName,
            string cookies,
            bool share = true)
        {
            var result = await _jioSaavnService.CreatePlaylistAsync(
                listName,
                cookies,
                share);

            return Ok(result);
        }

        // Add Song To Playlist
        [HttpPost]
        public async Task<IActionResult> AddSongToPlaylist(
            string playlistId,
            string songId,
            string language,
            string cookies)
        {
            var result = await _jioSaavnService.AddSongToPlaylistAsync(
                playlistId,
                songId,
                language,
                cookies);

            return Ok(result);
        }

        // Get User Playlists
        [HttpGet]
        public async Task<IActionResult> GetPlaylists(string cookies)
        {
            var result = await _jioSaavnService.GetPlaylistsAsync(cookies);

            return Ok(result);
        }
    }
}
