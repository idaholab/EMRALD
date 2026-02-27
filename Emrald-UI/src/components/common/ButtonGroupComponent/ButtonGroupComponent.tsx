import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React, { type PropsWithChildren } from 'react';
import { styled, useTheme } from '@mui/material/styles';

const GroupButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'itemSelected',
})(({ itemSelected }: { itemSelected: boolean }) => {
  const theme = useTheme();

  return {
    color: itemSelected ? theme.palette.primary.main : '#000',
    fontWeight: itemSelected ? 'bold' : 'normal',
  };
});

interface ButtonItemProps {
  value: string;
  itemSelected: boolean;
  handleClick: () => void;
}

const ButtonItem: React.FC<PropsWithChildren<ButtonItemProps>> = ({
  children,
  value,
  itemSelected,
  handleClick,
}) => {
  return (
    <GroupButton value={value} onClick={handleClick} itemSelected={itemSelected}>
      {children}
    </GroupButton>
  );
};

interface ButtonGroupProps {
  componentGroup: string;
  setComponentGroup: (value: string) => void;
}
const ButtonGroupComponent: React.FC<ButtonGroupProps> = ({
  componentGroup,
  setComponentGroup,
}) => {
  return (
    <ButtonGroup
      size="small"
      aria-label="small button group"
      variant="contained"
      color="secondary"
      sx={{ ml: 2, position: 'relative', top: 12 }}
    >
      <ButtonItem
        key="all"
        value="all"
        handleClick={() => {
          setComponentGroup('all');
        }}
        itemSelected={componentGroup === 'all'}
      >
        All
      </ButtonItem>
      <ButtonItem
        key="global"
        value="global"
        handleClick={() => {
          setComponentGroup('global');
        }}
        itemSelected={componentGroup === 'global'}
      >
        Global
      </ButtonItem>
      <ButtonItem
        key="local"
        value="local"
        handleClick={() => {
          setComponentGroup('local');
        }}
        itemSelected={componentGroup === 'local'}
      >
        Local
      </ButtonItem>
    </ButtonGroup>
  );
};

export default ButtonGroupComponent;
