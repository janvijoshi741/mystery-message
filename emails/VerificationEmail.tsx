import {
  Html,
  Head,
  Font,
  Preview,
  Section,
  Row,
  Text,
  Heading,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your Verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please use the following OTP to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text style={{ fontSize: "20px", fontWeight: "bold", margin: "10px 0" }}>
            {otp}
          </Text>
        </Row>

        <Row>
          <Text>If you did not request this code, please ignore this email.</Text>
        </Row>
      </Section>
    </Html>
  );
}
