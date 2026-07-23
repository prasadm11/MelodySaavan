using JioSaavanTrial.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JioSaavanTrial.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AIController : ControllerBase
    {
        private readonly MusicProfileService _musicProfileService;

        public AIController(
      MusicProfileService musicProfileService)
        {
            _musicProfileService = musicProfileService;
        }

        [HttpGet]
        public async Task<IActionResult> MusicProfile(
    string jioUserId,
    string cookies)
        {
            var result =
                await _musicProfileService.BuildMusicProfileAsync(
                    jioUserId,
                    cookies);

            return Ok(result);
        }
    }
}
