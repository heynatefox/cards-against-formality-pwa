import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  FormHelperText,
  Typography,
} from "@material-ui/core";

export const NEWSLETTER_UNLOCK_KEY = "caf_newsletter_unlocked";

export const isNewsletterUnlocked = () =>
  localStorage.getItem(NEWSLETTER_UNLOCK_KEY) === "true";

const API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY as string;
const PUB_ID = import.meta.env.VITE_BEEHIIV_PUB_ID as string;

async function subscribeToBeehiiv(email: string): Promise<void> {
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Beehiiv error: ${res.status}`);
  }
}

interface NewsletterGateProps {
  open: boolean;
  onUnlock: () => void;
  onClose: () => void;
}

export default function NewsletterGate({
  open,
  onUnlock,
  onClose,
}: NewsletterGateProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await subscribeToBeehiiv(email);
      localStorage.setItem(NEWSLETTER_UNLOCK_KEY, "true");
      onUnlock();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Unlock All Card Packs</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          The base pack is free for everyone. To unlock all other card packs,
          sign up for{" "}
          <strong>WTF Weekly</strong> — our newsletter.
        </Typography>
        <Input
          fullWidth
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
        />
        {error && (
          <FormHelperText error>{error}</FormHelperText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          No thanks
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !email.length}
        >
          {loading ? <CircularProgress size={20} /> : "Unlock packs"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
