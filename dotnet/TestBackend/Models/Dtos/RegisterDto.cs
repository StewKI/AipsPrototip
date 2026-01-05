using System.ComponentModel.DataAnnotations;

namespace TestBackend.Models.Dtos;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string UserName { get; set; } = string.Empty;
}
