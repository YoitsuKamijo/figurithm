import {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useTheme } from '@mui/material/styles';

export default function Navbar() {
    const theme = useTheme();
    const [isDrawerOpen, toggleDrawerOpen] = useState(false);

    return (
        <>
            { !isDrawerOpen &&
            <IconButton onClick={() => toggleDrawerOpen(!isDrawerOpen)} sx={{position: 'absolute', left: '16px',top: '16px', color: 'white'}} size="large">
                <MenuIcon />
            </IconButton>
            }
            <Drawer
                variant="persistent"
                anchor="left"
                open={isDrawerOpen}
                PaperProps={{
                    sx: {
                        backdropFilter: "blur(6px)",
                        backgroundColor: "transparent",
                        borderRight: "1px solid white"
                    }
                }}
                >
                <Box display='flex' justifyContent='end' p='8px'>
                    <IconButton onClick={() =>  toggleDrawerOpen(!isDrawerOpen)} sx={{color: 'white'}} size='large'>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <Box p={2} width='250px' textAlign='center'
                    role='presentation'
                    sx={{
                        color: 'white'
                    }}
                >
                    Hello World
                </Box>
            </Drawer>
        </>
    );
}