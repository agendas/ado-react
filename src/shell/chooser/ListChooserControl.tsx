import * as React from 'react';
import {ListChooserProps} from "./interfaces";
import {Checkbox, IconButton, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function ListChooserControl({lists, selected, onAddList, onSelect, onDeselect, onDelete}: ListChooserProps) {
    return (
        <List>
            {lists.map(list => {
                let isSelected = selected.has(list.id);
                let label = `list-chooser-checkbox-label-${list.id}`;
                return (
                    <ListItem button onClick={isSelected ? (() => onDeselect(list.id)) : (() => onSelect(list.id))}>
                        <ListItemText id={label}>{list.name}</ListItemText>
                        <IconButton onClick={() => onDelete(list.id)}><FontAwesomeIcon icon={faTrash} /></IconButton>
                        <Checkbox size="small" color="primary" checked={isSelected} tabIndex={-1} disableRipple inputProps={{'aria-labelledby': label}} />
                    </ListItem>
                );
            })}
            <ListItem button onClick={() => onAddList("New List")}>
                <ListItemIcon><FontAwesomeIcon icon={faPlus} /></ListItemIcon>
                <ListItemText>Add list</ListItemText>
            </ListItem>
        </List>
    );
}