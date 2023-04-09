import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setBackButtonShown} from "../../../modules/document";
import {useHistory, useLocation} from "react-router-dom";

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/ic_flag_en.svg',
  },
  {
    value: 'de',
    label: 'German',
    icon: '/assets/icons/ic_flag_de.svg',
  },
  {
    value: 'fr',
    label: 'French',
    icon: '/assets/icons/ic_flag_fr.svg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {

    const backButtonShown = useSelector((state) => state.documentReducer.backButtonShown);
  const [open, setOpen] = useState(null);


    const handleClick = () => {
        window.history.back();
    };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
            display:(useLocation().pathname.startsWith("/dashboard/projects/")?"":"none"),
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
          }),
        }}
      >
        <img src={'/assets/icons/navbar/back.svg'} alt={LANGS[0].label} />
      </IconButton>

    </>
  );
}
