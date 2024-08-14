import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useTheme } from '@mui/material/styles';
import ListSubheader from '@mui/material/ListSubheader';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import Box from '@mui/material/Box';
import { categoryMap } from './constants';

export default function Navbar({ onAnimatorUpdate }) {
    const theme = useTheme();

    const categories = ['search', 'dynamic programming']
    const [isCategoryMenuOpen, setCategoryMenu] = useState(new Array(categories.length).fill(false));
    const [isDrawerOpen, toggleDrawerOpen] = useState(false);

    function toggleCategoryMenu(index: number) {
        isCategoryMenuOpen[index] = !isCategoryMenuOpen[index]
        setCategoryMenu([...isCategoryMenuOpen]);
    }

    return (
        <>
            {!isDrawerOpen &&
                <IconButton onClick={() => toggleDrawerOpen(!isDrawerOpen)} sx={{ position: 'absolute', left: '16px', top: '16px', color: 'white' }} size="large">
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
                        borderRight: "3px solid white",
                        color: "white"
                    }
                }}
            >
                <Box display='flex' justifyContent='end' p='8px'>
                    <IconButton onClick={() => toggleDrawerOpen(!isDrawerOpen)} sx={{ color: 'white' }} size='large'>
                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <List
                    sx={{ width: '250px' }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    {categories.map((category, index) => (
                        <>
                            <ListItemButton onClick={() => { toggleCategoryMenu(index) }}>
                                <ListItemText primary={categories[index]} />
                                {isCategoryMenuOpen[index] ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={isCategoryMenuOpen[index]} timeout="auto" unmountOnExit>
                                {categoryMap[category].map((item, index) => (
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: 4 }} onClick={() => onAnimatorUpdate(item)}>
                                            <ListItemText primary={item} />
                                        </ListItemButton>
                                    </List>
                                ))}
                            </Collapse>
                        </>
                    ))}
                </List>
            </Drawer>
        </>
    );
}