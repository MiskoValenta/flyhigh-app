using Application.Interfaces.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Services.Emails;

public class EmailService : IEmailService
{
  private readonly EmailSettings _emailSettings;

  public EmailService(IOptions<EmailSettings> emailSettings)
  {
    _emailSettings = emailSettings.Value;
  }

  public async Task SendWelcomeEmailAsync(string toEmail, string firstName)
  {
    string subject = "Vítejte ve FlyHigh!";
    string htmlBody = $@"
            <h2>Ahoj {firstName},</h2>
            <p>jsme nadšeni, že ses přidal/a do aplikace FlyHigh.</p>
            <p>Nyní můžeš spravovat své volejbalové týmy, plánovat zápasy a zapisovat skóre.</p>
            <br/>
            <p>S pozdravem,<br/>Tým FlyHigh</p>";

    await SendEmailAsync(toEmail, subject, htmlBody);
  }

  public async Task SendPasswordResetEmailAsync(string toEmail, string newPassword)
  {
    string subject = "FlyHigh - Obnovení hesla";
    string htmlBody = $@"
            <h2>Obnovení hesla</h2>
            <p>Bylo vyžádáno obnovení hesla k tvému účtu ve FlyHigh.</p>
            <p>Tvé nové dočasné heslo je: <strong>{newPassword}</strong></p>
            <p>Po přihlášení ti doporučujeme si heslo změnit v nastavení profilu.</p>
            <br/>
            <p>S pozdravem,<br/>Tým FlyHigh</p>";

    await SendEmailAsync(toEmail, subject, htmlBody);
  }

  private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
  {
    var email = new MimeMessage();
    email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
    email.To.Add(MailboxAddress.Parse(toEmail));
    email.Subject = subject;

    var builder = new BodyBuilder { HtmlBody = htmlBody };
    email.Body = builder.ToMessageBody();

    using var smtp = new SmtpClient();
    try
    {

      await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.SslOnConnect);
      await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
      await smtp.SendAsync(email);
    }
    catch (Exception ex)
    {
      throw new Exception($"Nepodařilo se odeslat email: {ex.Message}");
    }
    finally
    {
      await smtp.DisconnectAsync(true);
    }
  }
}
