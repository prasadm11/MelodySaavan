using JioSaavanTrial.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JioSaavanTrial.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public HealthController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient(nameof(JioSaavnService));
        }

        [HttpGet]
        public async Task<IActionResult> Ping()
        {
            var endpoints = new[]
            {
                "?__call=search.getResults",
                "?__call=song.getDetails",
                "?__call=content.getAlbums",
                "?__call=content.getCharts",
                "?__call=content.getFeaturedPlaylists",
                "?__call=social.getTopArtists"
            };

            var details = new List<object>();

            foreach (var endpoint in endpoints)
            {
                try
                {
                    var response = await _httpClient.GetAsync(endpoint);

                    details.Add(new
                    {
                        url = "https://www.jiosaavn.com/api.php" + endpoint,
                        status = response.IsSuccessStatusCode ? "ok" : "failed"
                    });
                }
                catch
                {
                    details.Add(new
                    {
                        url = "https://www.jiosaavn.com/api.php" + endpoint,
                        status = "failed"
                    });
                }
            }

            var healthy = details.All(x => x.GetType().GetProperty("status")!.GetValue(x)!.ToString() == "ok");

            return Ok(new
            {
                msg = "Pong!",
                status = healthy ? "healthy" : "unhealthy",
                details
            });
        }
    }
}
