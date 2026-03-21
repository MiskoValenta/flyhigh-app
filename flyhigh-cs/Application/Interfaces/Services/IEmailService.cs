using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Interfaces.Services;

public interface IEmailService
{
  Task SendWelcomeEmailAsync(string toEmail, string firstName);
  Task SendPasswordResetEmailAsync(string toEmail, string newPassword);
}
