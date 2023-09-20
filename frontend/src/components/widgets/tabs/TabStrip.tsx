import { Box, SxProps, Tab, capitalize } from '@mui/material';
import { TabContext, TabList, TabListProps, TabPanel } from '@mui/lab';
import { Link, useLocation } from 'react-router-dom';
import React, { Fragment } from 'react';

interface TabProps {
  id: string;
  icon?: React.ReactElement;
  label?: string;
  content: React.ReactNode;
}

interface TabStripProps extends TabListProps {
  tabs: readonly TabProps[];
  tabStripContainerSx?: SxProps;
  TabPanelContainer?: React.ComponentType<{ children: React.ReactNode }>;
}

const TabStrip: React.FC<TabStripProps> = ({
  tabs,
  tabStripContainerSx,
  TabPanelContainer = Fragment,
  ...muiTabListProps
}: TabStripProps) => {
  const { hash, pathname } = useLocation();

  // Always remove any trailing slash that may be in the pathname so we can add our own

  const pathName = pathname.replace(/\/+$/, '');

  const getTabHref = (tabName: string) => {
    return `${pathName}/#${tabName}`;
  };

  const activeTab = hash ? hash.replace(/#/, '') : tabs[0].id;

  // Generate the MUI Tab components

  const elTabs = tabs.map(({ id, icon, label }) => (
    <Tab
      key={`tab-${id}`}
      value={id}
      component={Link}
      to={getTabHref(id)}
      icon={icon}
      iconPosition='start'
      label={label || capitalize(id)}
      sx={{ textTransform: 'none' }}
    />
  ));

  // Generate the MUI Tab Panel components

  const elTabPanels = tabs.map(({ id, content }) => (
    <TabPanel key={`panel-${id}`} value={id}>
      {content}
    </TabPanel>
  ));

  return (
    <TabContext value={activeTab}>
      <Box
        sx={{
          display: 'grid',
          ...tabStripContainerSx
        }}
      >
        <TabList {...muiTabListProps}>{elTabs}</TabList>
        <TabPanelContainer>{elTabPanels}</TabPanelContainer>
      </Box>
    </TabContext>
  );
};

export default TabStrip;
