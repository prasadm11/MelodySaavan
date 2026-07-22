namespace JioSaavanTrial.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string JioUserId { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Gender { get; set; } = string.Empty;

        public int BirthYear { get; set; }

        public string Username { get; set; } = string.Empty;

        public string CustomUsername { get; set; } = string.Empty;

        public string Network { get; set; } = string.Empty;

        public bool IsJioUser { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime LastLogin { get; set; }
    }
}
