namespace JioSaavanTrial.Models
{
    public class AIRecommendation
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string SongId { get; set; } = string.Empty;

        public decimal Score { get; set; }

        public string Reason { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
