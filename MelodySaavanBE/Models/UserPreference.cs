namespace JioSaavanTrial.Models
{
    public class UserPreference
    {
        public Guid UserId { get; set; }

        public string FavouriteLanguage { get; set; } = string.Empty;

        public string FavouriteGenre { get; set; } = string.Empty;

        public string FavouriteArtist { get; set; } = string.Empty;

        public string FavouriteMood { get; set; } = string.Empty;

        public DateTime UpdatedAt { get; set; }
    }
}
