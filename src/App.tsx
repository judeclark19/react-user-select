import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import type { User } from "./types/user";
import { formatDisplayName, includesIgnoreCase } from "./utils/nameFormat";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import LanguageOutlined from "@mui/icons-material/LanguageOutlined";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import OpenInNewOutlined from "@mui/icons-material/OpenInNewOutlined";

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
              Search Users
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={56} sx={{ width: "100%" }} />
            ) : error ? (
              <Typography variant="body1" color="error">
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
                  noOptionsText={
                    search.trim() ? `No results for "${search}"` : "No results"
                  }
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
            {selectedUser && (
              <Typography variant="body1" component="p" gutterBottom>
                User Details
              </Typography>
            )}
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {/* Selected User */}
              {selectedUser
                ? `${formatDisplayName(selectedUser.name).display}`
                : "No User Selected"}
            </Typography>
            {!selectedUser ? (
              <Typography variant="body1" color="text.secondary">
                Select a user above to see details.
              </Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Contact
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <EmailOutlined fontSize="small" aria-hidden />
                      <Link href={`mailto:${selectedUser.email}`}>
                        {selectedUser.email}
                      </Link>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <PhoneOutlined fontSize="small" aria-hidden />
                      <Typography variant="body1">
                        {selectedUser.phone}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LanguageOutlined fontSize="small" aria-hidden />
                      <Link
                        href={`https://${selectedUser.website}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visit ${selectedUser.website} (opens in a new tab)`}
                      >
                        {selectedUser.website}
                      </Link>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Address / Company
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <LocationOnOutlined fontSize="small" aria-hidden />
                      <Box>
                        <Typography variant="body1" color="text.secondary">
                          {selectedUser.address.street}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {selectedUser.address.suite}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {selectedUser.address.city},{" "}
                          {selectedUser.address.zipcode}
                        </Typography>

                        <Link
                          href={`https://www.google.com/maps?q=${selectedUser.address.geo.lat},${selectedUser.address.geo.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="View on Google Maps (opens in a new tab)"
                          sx={{ display: "inline-block", mt: 0.5 }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5
                            }}
                          >
                            View on Google Maps
                            <OpenInNewOutlined fontSize="inherit" />
                          </Box>
                        </Link>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <BusinessOutlined fontSize="small" aria-hidden />
                      <Typography variant="body1" color="text.secondary">
                        {selectedUser.company.name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
