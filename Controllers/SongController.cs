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
    }
}
