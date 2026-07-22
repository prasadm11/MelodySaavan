using JioSaavanTrial.Models;
using JioSaavanTrial.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JioSaavanTrial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonalizationController : ControllerBase
    {
        private readonly PersonalizationRepository _repository;

        public PersonalizationController(PersonalizationRepository repository)
        {
            _repository = repository;
        }


        #region User

        [HttpPost("UpsertUser")]
        public async Task<IActionResult> UpsertUser(User user)
        {
            return Ok(await _repository.UpsertUserAsync(user));
        }

        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser(string jioUserId)
        {
            return Ok(await _repository.GetUserAsync(jioUserId));
        }

        #endregion

        #region Play History

        [HttpPost("AddPlayHistory")]
        public async Task<IActionResult> AddPlayHistory(PlayHistory history)
        {
            return Ok(await _repository.AddPlayHistoryAsync(history));
        }

        [HttpGet("GetPlayHistory")]
        public async Task<IActionResult> GetPlayHistory(string jioUserId)
        {
            return Ok(await _repository.GetPlayHistoryAsync(jioUserId));
        }

        #endregion

        #region Liked Songs

        [HttpPost("LikeSong")]
        public async Task<IActionResult> LikeSong(LikedSong song)
        {
            return Ok(await _repository.LikeSongAsync(song));
        }

        [HttpDelete("UnlikeSong")]
        public async Task<IActionResult> UnlikeSong(string jioUserId, string songId)
        {
            return Ok(await _repository.UnlikeSongAsync(jioUserId, songId));
        }

        [HttpGet("GetLikedSongs")]
        public async Task<IActionResult> GetLikedSongs(string jioUserId)
        {
            return Ok(await _repository.GetLikedSongsAsync(jioUserId));
        }

        #endregion

        #region Search History

        [HttpPost("AddSearch")]
        public async Task<IActionResult> AddSearch(SearchHistory history)
        {
            return Ok(await _repository.AddSearchAsync(history));
        }

        [HttpGet("GetSearchHistory")]
        public async Task<IActionResult> GetSearchHistory(string jioUserId)
        {
            return Ok(await _repository.GetSearchHistoryAsync(jioUserId));
        }

        [HttpDelete("ClearSearchHistory")]
        public async Task<IActionResult> ClearSearchHistory(string jioUserId)
        {
            return Ok(await _repository.ClearSearchHistoryAsync(jioUserId));
        }

        #endregion

        #region Preferences

        [HttpGet("GetPreferences")]
        public async Task<IActionResult> GetPreferences(string jioUserId)
        {
            return Ok(await _repository.GetPreferencesAsync(jioUserId));
        }

        #endregion

        #region Recommendations

        [HttpGet("GetRecommendations")]
        public async Task<IActionResult> GetRecommendations(string jioUserId)
        {
            return Ok(await _repository.GetRecommendationsAsync(jioUserId));
        }

        #endregion
    }
}
