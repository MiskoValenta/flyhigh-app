using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Users;

public record RegisterRequest(string FirstName, string LastName, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthTokens(string AccessToken, string RefreshToken);
public record UserProfileDto(Guid Id, string Email, string FirstName, string LastName);
public record ForgotPasswordRequest(string Email);