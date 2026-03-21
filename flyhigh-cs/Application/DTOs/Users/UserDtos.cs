using System;
using System.Collections.Generic;
using System.Text;

namespace Application.DTOs.Users;

public record UpdateProfileDto(string FirstName, string LastName, string Email);
public record ChangePasswordDto(string OldPassword, string NewPassword);
