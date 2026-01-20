import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Skeleton,
  Typography
} from "@mui/material";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    bs: string;
    catchPhrase: string;
    name: string;
  };
};

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(USERS_URL);
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as User[];
        if (!cancelled) {
          setUsers(data);
          console.log("Loaded users:", data);
        }
      } catch (e) {
        if (!cancelled) {
          const message = e instanceof Error ? e.message : "Unknown error";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <Container maxWidth="md" sx={{ py: 2, mx: "auto" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: 600 }}
        >
          User Directory
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3 }}
          textAlign="center"
        >
          Search and select a user from the directory.
        </Typography>

        <Card variant="outlined" sx={{ boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Search
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={56} sx={{ width: "100%" }} />
            ) : error ? (
              <Typography variant="body2" color="error">
                Failed to load users: {error}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loaded {users.length} users. (Autocomplete goes here next.)
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mt: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Selected User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a user to see details.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
