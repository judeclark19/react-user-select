import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  Link,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import type { User } from "./types/user";
import { formatDisplayName, includesIgnoreCase } from "./utils/nameFormat";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    // Guard against setting state after the component unmounts
    // (e.g., if the fetch resolves after unmount or during React StrictMode re-renders)
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

  const options = users
    .map((u) => {
      const formatted = formatDisplayName(u.name);
      return {
        user: u,
        label: formatted.display,
        lastKey: formatted.lastKey,
        firstKey: formatted.firstKey
      };
    })
    .sort((a, b) => {
      if (a.lastKey < b.lastKey) return -1;
      if (a.lastKey > b.lastKey) return 1;
      if (a.firstKey < b.firstKey) return -1;
      if (a.firstKey > b.firstKey) return 1;
      return 0;
    })
    .filter((o) =>
      search.trim().length === 0 ? true : includesIgnoreCase(o.label, search)
    );

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
              <>
                <Autocomplete
                  options={options}
                  value={
                    selectedUser
                      ? (options.find((o) => o.user.id === selectedUser.id) ??
                        null)
                      : null
                  }
                  inputValue={search}
                  onInputChange={(_, value) => {
                    setSearch(value);
                  }}
                  onChange={(_, option) => {
                    setSelectedUser(option?.user ?? null);
                  }}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.user.id === b.user.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search users"
                      placeholder="Type a name…"
                    />
                  )}
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mt: 3, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Selected User
            </Typography>
            {!selectedUser ? (
              <Typography variant="body2" color="text.secondary">
                Select a user to see details.
              </Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {formatDisplayName(selectedUser.name).display}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  @{selectedUser.username}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Email:{" "}
                    <Link href={`mailto:${selectedUser.email}`}>
                      {selectedUser.email}
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    Phone: {selectedUser.phone}
                  </Typography>
                  <Typography variant="body2">
                    Website:{" "}
                    <Link
                      href={`https://${selectedUser.website}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {selectedUser.website}
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.address.street} {selectedUser.address.suite}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.address.city}, {selectedUser.address.zipcode}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Company
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.company.name}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
