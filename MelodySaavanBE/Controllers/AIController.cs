using JioSaavanTrial.Models;
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
        private readonly GeminiService _geminiService;


        public AIController(
      MusicProfileService musicProfileService,GeminiService geminiService)
        {
            _musicProfileService = musicProfileService;
            _geminiService = geminiService;
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

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var response = await _geminiService.ChatAsync(request);

            return Ok(response);
        }

    }
}
