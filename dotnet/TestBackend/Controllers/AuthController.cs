using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TestBackend.Models;
using TestBackend.Models.Dtos;

namespace TestBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser
        {
            UserName = model.UserName,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { message = "User registered successfully", userId = user.Id, userName = user.UserName });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: false, lockoutOnFailure: true);

        if (result.Succeeded)
        {
            return Ok(new { message = "Login successful", userId = user.Id, userName = user.UserName });
        }

        if (result.IsLockedOut)
        {
            return Unauthorized(new { message = "Account locked due to multiple failed login attempts" });
        }

        return Unauthorized(new { message = "Invalid email or password" });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (!User.Identity?.IsAuthenticated ?? true)
            return Unauthorized();

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return Unauthorized();

        return Ok(new { userId = user.Id, userName = user.UserName, email = user.Email });
    }
}
