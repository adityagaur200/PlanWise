// MeetingCard.js
import { Card, Typography, AvatarGroup, Avatar, Box } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MeetingCard = ({ title, description, time, avatars }) => (
  <Card sx={{ p: 2, mb: 2, borderLeft: '4px solid #8e44ad', backgroundColor: '#f8f6fc' }}>
    <Typography variant="caption" color="primary">MEETING</Typography>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="textSecondary">{description}</Typography>
    <Box display="flex" alignItems="center" mt={1}>
      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="body2">{time}</Typography>
    </Box>
    <AvatarGroup max={4} sx={{ mt: 1 }}>
      {avatars.map((src, index) => (
        <Avatar key={index} src={src} />
      ))}
    </AvatarGroup>
  </Card>
);

export default MeetingCard;
