import { Box, Card, CardContent, Container, Typography } from "@mui/material";

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default"
      }}
    >
      <Container maxWidth="md" sx={{ py: 2, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
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

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Autocomplete will go here next.)
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
