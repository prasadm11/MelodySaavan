using System.Security.Cryptography;
using System.Text;

namespace JioSaavanTrial.Services
{
    public class CryptoService
    {
        private const string SecretKey = "38346591";

        public string DecryptUrl(string encryptedMediaUrl)
        {
            if (string.IsNullOrWhiteSpace(encryptedMediaUrl))
                return string.Empty;

            // Step 1: Base64 Decode
            byte[] encryptedBytes = Convert.FromBase64String(encryptedMediaUrl);

            // Step 2: Create DES
            using var des = DES.Create();

            des.Mode = CipherMode.ECB;
            des.Padding = PaddingMode.PKCS7;

            des.Key = Encoding.UTF8.GetBytes(SecretKey);

            // Step 3: Decrypt
            using ICryptoTransform decryptor = des.CreateDecryptor();

            byte[] decryptedBytes = decryptor.TransformFinalBlock(
                encryptedBytes,
                0,
                encryptedBytes.Length);

            // Step 4: Convert to string
            string decryptedUrl = Encoding.UTF8.GetString(decryptedBytes);

            // Step 5: Replace quality
            return decryptedUrl.Replace("_96.mp4", "_320.mp4");
        }
    }
}
