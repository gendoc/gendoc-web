import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  const handleClick = () =>{
      if (title=='전문가 작성 가이드') {
          window.open("https://gendoc-prod.s3.ap-northeast-2.amazonaws.com/%E1%84%8F%E1%85%A5%E1%86%AB%E1%84%89%E1%85%A5%E1%86%AF%E1%84%90%E1%85%A5%E1%86%AB%E1%84%90%E1%85%B3+%E1%84%8C%E1%85%A1%E1%86%A8%E1%84%89%E1%85%A5%E1%86%BC%E1%84%87%E1%85%A5%E1%86%B8+%E1%84%86%E1%85%A6%E1%84%82%E1%85%B2%E1%84%8B%E1%85%A5%E1%86%AF+%E1%84%80%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3+1%E1%84%87%E1%85%AE.pdf", '_blank');
      } else if (title=="내 드라이브"){

      } else {
          alert("Coming soon!")
      }
  }



  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      onClick={handleClick}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
