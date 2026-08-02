using System.Text.Json;

namespace JioSaavanTrial.Models
{
    public class ChatResponse
    {
        //public object Response { get; set; } = string.Empty;
        // public JsonElement Response { get; set; }
        
        public string Type { get; set; } = string.Empty;

        public JsonElement Data { get; set; }

        public bool Success { get; set; } = true;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}
