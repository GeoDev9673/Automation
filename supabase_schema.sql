-- =========================================================
-- PARALIFE - Supabase Database Setup + Instant Resend Welcome Email
-- =========================================================

-- 1. Enable pg_net extension for instant HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the subscribers table (if not exists)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL
);

-- 3. Create unique case-insensitive index on email
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_idx ON public.subscribers (lower(email));

-- 4. Set permissions
ALTER TABLE public.subscribers DISABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;
GRANT ALL ON TABLE public.subscribers TO anon, authenticated, public;

-- 5. Trigger Function: Send Styled Welcome Email via Resend instantly on new subscriber
CREATE OR REPLACE FUNCTION public.send_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
  resend_api_key TEXT := 're_gBHHz68V_15QVoWxDWJsUPPkK6MeDXjjE';
  email_html TEXT;
BEGIN
  email_html := $HTML$
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PARALIFE — Follow the Signal</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #121316 !important;
      color: #F2EEE8 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    td {
      padding: 0;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 32px 16px !important;
      }
      .hero-title {
        font-size: 28px !important;
        line-height: 34px !important;
      }
      .nav-cell {
        display: inline-block !important;
        padding: 6px 12px 6px 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #121316; color: #F2EEE8;">

  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #121316; mso-hide: all;">
    You are now following the signal. Welcome to PARALIFE — Less Noise. More Life.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-wrapper" style="background-color: #121316; width: 100%; min-height: 100vh; padding: 60px 20px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; margin: 0 auto;">
          
          <!-- 01. HEADER -->
          <tr>
            <td align="left" style="padding-bottom: 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <span style="font-size: 20px; font-weight: 700; letter-spacing: 0.26em; color: #F2EEE8; text-transform: uppercase;">
                      PARALIFE
                    </span>
                  </td>
                  <td align="right">
                    <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: #FF2D85;">
                      +signal
                    </span>
                  </td>
                </tr>
              </table>
              <div style="height: 1px; background-color: rgba(242, 238, 232, 0.12); margin-top: 20px; width: 100%;"></div>
            </td>
          </tr>

          <!-- 02. BODY -->
          <tr>
            <td align="left" style="padding-bottom: 40px;">
              
              <p style="margin: 0 0 16px 0; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(242, 238, 232, 0.52);">
                FREQUENCY INITIALIZED
              </p>

              <h1 class="hero-title" style="margin: 0 0 28px 0; font-size: 36px; line-height: 42px; font-weight: 400; letter-spacing: -0.02em; color: #F2EEE8;">
                You are now following the signal.
              </h1>

              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 26px; font-weight: 400; letter-spacing: 0.01em; color: rgba(242, 238, 232, 0.76);">
                Thank you for connecting. This is where music, memory, and visual storytelling converge.
              </p>

              <p style="margin: 0 0 36px 0; font-size: 15px; line-height: 26px; font-weight: 400; letter-spacing: 0.01em; color: rgba(242, 238, 232, 0.76);">
                We value your attention. There will be no spam, promotions, or unnecessary noise — only direct transmissions when new songs are released, cinema pieces unfold, or hidden archives are unlocked.
              </p>

              <!-- Quote Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px; background-color: #17181d; border-left: 2px solid #FF2D85;">
                <tr>
                  <td style="padding: 22px 26px;">
                    <div style="font-size: 15px; font-style: italic; line-height: 24px; color: #F2EEE8; letter-spacing: 0.02em;">
                      “Some places remember us long before we remember them.”
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Link -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <a href="https://paralifemusic.com" target="_blank" style="display: inline-block; background-color: #FF2D85; color: #ffffff; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; padding: 16px 32px; text-decoration: none;">
                      +ENTER EXPERIENCE
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 03. DIVIDER -->
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="height: 1px; background-color: rgba(242, 238, 232, 0.12); width: 100%;"></div>
            </td>
          </tr>

          <!-- 04. FOOTER -->
          <tr>
            <td align="left">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="padding-bottom: 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td class="nav-cell" style="padding-right: 20px;">
                          <a href="https://www.instagram.com/paralifeofficial/" target="_blank" style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 238, 232, 0.76); font-weight: 500;">
                            Instagram
                          </a>
                        </td>
                        <td class="nav-cell" style="padding-right: 20px;">
                          <a href="https://www.tiktok.com/@paralifemusic" target="_blank" style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 238, 232, 0.76); font-weight: 500;">
                            TikTok
                          </a>
                        </td>
                        <td class="nav-cell" style="padding-right: 20px;">
                          <a href="https://www.youtube.com/@Paralifemusic" target="_blank" style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 238, 232, 0.76); font-weight: 500;">
                            YouTube
                          </a>
                        </td>
                        <td class="nav-cell">
                          <a href="mailto:hello@paralifemusic.com" style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 238, 232, 0.76); font-weight: 500;">
                            Contact
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <p style="margin: 0 0 8px 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(242, 238, 232, 0.52);">
                      © PARALIFE • Less Noise. More Life.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
$HTML$;

  -- Make asynchronous HTTP POST call to Resend API
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || resend_api_key
    ),
    body := jsonb_build_object(
      'from', 'PARALIFE <onboarding@resend.dev>',
      'to', jsonb_build_array(NEW.email),
      'subject', 'Welcome to PARALIFE — Follow the Signal',
      'html', email_html
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach the trigger to subscribers table
DROP TRIGGER IF EXISTS on_subscriber_created ON public.subscribers;
CREATE TRIGGER on_subscriber_created
AFTER INSERT ON public.subscribers
FOR EACH ROW EXECUTE FUNCTION public.send_welcome_email();
