using Dapper;
using JioSaavanTrial.Database;
using JioSaavanTrial.Models;

namespace JioSaavanTrial.Repositories
{
    public class PersonalizationRepository
    {
        private readonly DatabaseConnection _database;

        public PersonalizationRepository(DatabaseConnection database)
        {
            _database = database;
        }

        #region User

        public async Task<bool> UpsertUserAsync(User user)
        {
            const string sql = @"
                INSERT INTO users
                (
                    id,
                    jio_user_id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    gender,
                    birth_year,
                    username,
                    custom_username,
                    network,
                    is_jio_user,
                    created_at,
                    updated_at,
                    last_login
                )
                VALUES
                (
                    @Id,
                    @JioUserId,
                    @FirstName,
                    @LastName,
                    @Email,
                    @Phone,
                    @Gender,
                    @BirthYear,
                    @Username,
                    @CustomUsername,
                    @Network,
                    @IsJioUser,
                    @CreatedAt,
                    @UpdatedAt,
                    @LastLogin
                )
                ON CONFLICT (jio_user_id)
                DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    gender = EXCLUDED.gender,
                    birth_year = EXCLUDED.birth_year,
                    username = EXCLUDED.username,
                    custom_username = EXCLUDED.custom_username,
                    network = EXCLUDED.network,
                    is_jio_user = EXCLUDED.is_jio_user,
                    updated_at = EXCLUDED.updated_at,
                    last_login = EXCLUDED.last_login;";

            if (user.Id == Guid.Empty)
                user.Id = Guid.NewGuid();

            var now = DateTime.UtcNow;

            if (user.CreatedAt == default)
                user.CreatedAt = now;

            user.UpdatedAt = now;
            user.LastLogin = now;

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(sql, user);

            return rows > 0;
        }

        public async Task<User?> GetUserAsync(string jioUserId)
        {
            const string sql = @"
                SELECT *
                FROM users
                WHERE jio_user_id = @JioUserId;";

            using var connection = _database.CreateConnection();

            return await connection.QueryFirstOrDefaultAsync<User>(
                sql,
                new
                {
                    JioUserId = jioUserId
                });
        }

        #endregion


        #region Play History

        public async Task<bool> AddPlayHistoryAsync(PlayHistory history)
        {
            const string sql = @"
        INSERT INTO play_history
        (
            id,
            user_id,
            song_id,
            played_at,
            played_duration,
            song_duration,
            completed,
            source,
            play_count,
            last_played_at
        )
        VALUES
        (
            @Id,
            @UserId,
            @SongId,
            @PlayedAt,
            @PlayedDuration,
            @SongDuration,
            @Completed,
            @Source,
            @PlayCount,
            @LastPlayedAt
        );";

            if (history.Id == Guid.Empty)
                history.Id = Guid.NewGuid();

            if (history.PlayedAt == default)
                history.PlayedAt = DateTime.UtcNow;

            if (history.LastPlayedAt == default)
                history.LastPlayedAt = DateTime.UtcNow;

            if (history.PlayCount <= 0)
                history.PlayCount = 1;

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(sql, history);

            return rows > 0;
        }

        public async Task<List<PlayHistory>> GetPlayHistoryAsync(string jioUserId)
        {
            const string sql = @"
        SELECT ph.*
        FROM play_history ph
        INNER JOIN users u
            ON ph.user_id = u.id
        WHERE u.jio_user_id = @JioUserId
        ORDER BY ph.last_played_at DESC;";

            using var connection = _database.CreateConnection();

            var result = await connection.QueryAsync<PlayHistory>(
                sql,
                new
                {
                    JioUserId = jioUserId
                });

            return result.ToList();
        }

        #endregion

        #region Liked Songs

        public async Task<bool> LikeSongAsync(LikedSong song)
        {
            const string sql = @"
        INSERT INTO liked_songs
        (
            id,
            user_id,
            song_id,
            liked_at
        )
        VALUES
        (
            @Id,
            @UserId,
            @SongId,
            @LikedAt
        )
        ON CONFLICT (user_id, song_id)
        DO NOTHING;";

            if (song.Id == Guid.Empty)
                song.Id = Guid.NewGuid();

            if (song.LikedAt == default)
                song.LikedAt = DateTime.UtcNow;

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(sql, song);

            return rows > 0;
        }

        public async Task<bool> UnlikeSongAsync(string jioUserId, string songId)
        {
            const string sql = @"
        DELETE FROM liked_songs
        WHERE user_id = (
            SELECT id
            FROM users
            WHERE jio_user_id = @JioUserId
        )
        AND song_id = @SongId;";

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(sql, new
            {
                JioUserId = jioUserId,
                SongId = songId
            });

            return rows > 0;
        }

        public async Task<List<LikedSong>> GetLikedSongsAsync(string jioUserId)
        {
            const string sql = @"
        SELECT ls.*
        FROM liked_songs ls
        INNER JOIN users u
            ON ls.user_id = u.id
        WHERE u.jio_user_id = @JioUserId
        ORDER BY ls.liked_at DESC;";

            using var connection = _database.CreateConnection();

            var result = await connection.QueryAsync<LikedSong>(
                sql,
                new
                {
                    JioUserId = jioUserId
                });

            return result.ToList();
        }

        #endregion

        #region Search History

        public async Task<bool> AddSearchAsync(SearchHistory history)
        {
            const string sql = @"
        INSERT INTO search_history
        (
            id,
            user_id,
            keyword,
            search_type,
            created_at
        )
        VALUES
        (
            @Id,
            @UserId,
            @Keyword,
            @SearchType,
            @CreatedAt
        );";

            if (history.Id == Guid.Empty)
                history.Id = Guid.NewGuid();

            if (history.CreatedAt == default)
                history.CreatedAt = DateTime.UtcNow;

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(sql, history);

            return rows > 0;
        }

        public async Task<List<SearchHistory>> GetSearchHistoryAsync(string jioUserId)
        {
            const string sql = @"
        SELECT sh.*
        FROM search_history sh
        INNER JOIN users u
            ON sh.user_id = u.id
        WHERE u.jio_user_id = @JioUserId
        ORDER BY sh.created_at DESC;";

            using var connection = _database.CreateConnection();

            var result = await connection.QueryAsync<SearchHistory>(
                sql,
                new
                {
                    JioUserId = jioUserId
                });

            return result.ToList();
        }

        public async Task<bool> ClearSearchHistoryAsync(string jioUserId)
        {
            const string sql = @"
        DELETE FROM search_history
        WHERE user_id = (
            SELECT id
            FROM users
            WHERE jio_user_id = @JioUserId
        );";

            using var connection = _database.CreateConnection();

            var rows = await connection.ExecuteAsync(
                sql,
                new
                {
                    JioUserId = jioUserId
                });

            return rows > 0;
        }

        #endregion

        #region Preferences

        public async Task<UserPreference?> GetPreferencesAsync(string jioUserId)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> SavePreferencesAsync(UserPreference preference)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region AI Recommendations

        public async Task<List<AIRecommendation>> GetRecommendationsAsync(string jioUserId)
        {
            const string sql = @"
        SELECT ar.*
        FROM ai_recommendations ar
        INNER JOIN users u
            ON ar.user_id = u.id
        WHERE u.jio_user_id = @JioUserId
        ORDER BY ar.score DESC, ar.created_at DESC;";

            using var connection = _database.CreateConnection();

            var result = await connection.QueryAsync<AIRecommendation>(
                sql,
                new
                {
                    JioUserId = jioUserId
                });

            return result.ToList();
        }

        public async Task<bool> SaveRecommendationsAsync(List<AIRecommendation> recommendations)
        {
            const string sql = @"
        INSERT INTO ai_recommendations
        (
            id,
            user_id,
            song_id,
            score,
            reason,
            created_at
        )
        VALUES
        (
            @Id,
            @UserId,
            @SongId,
            @Score,
            @Reason,
            @CreatedAt
        );";

            using var connection = _database.CreateConnection();

            foreach (var recommendation in recommendations)
            {
                if (recommendation.Id == Guid.Empty)
                    recommendation.Id = Guid.NewGuid();

                if (recommendation.CreatedAt == default)
                    recommendation.CreatedAt = DateTime.UtcNow;
            }

            var rows = await connection.ExecuteAsync(sql, recommendations);

            return rows > 0;
        }

        #endregion
    }
}
