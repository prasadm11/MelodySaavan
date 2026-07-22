namespace JioSaavanTrial.Models
{
    public class SearchHistory
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Keyword { get; set; } = string.Empty;

        public string SearchType { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
