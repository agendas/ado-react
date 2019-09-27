import * as React from 'react';
import {ListChooserProps} from "./interfaces";
import {Button, ListGroup, OverlayTrigger, Popover} from "react-bootstrap";
import {faPlus as plus, faCaretDown as caretDown} from "@fortawesome/free-solid-svg-icons";
import {faCheckCircle as check} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {TaskList} from "../../core/models";
import {Optional} from "../../core/utils";

function selectedDescription(lists: Optional<Map<string, TaskList>>, selected: Set<string>) {
    if (selected.size === 0) {
        return "Select Lists...";
    } else if (selected.size === 1) {
        let list = lists && lists.get(selected.entries().next().value[1]);
        return (list && list.name) || "1 List";
    } else {
        return `${selected.size} Lists`;
    }
}

export default function ListChooserControl({lists, listMap, selected, onAddList, onSelect, onDeselect}: ListChooserProps) {
    let id = `list-chooser-toggle`;

    return (
        <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={
            <Popover id={id}>
                <Popover.Title>Lists</Popover.Title>
                <Popover.Content className="p-0">
                    <ListGroup variant="flush">
                        {lists.map(list => {
                            let isSelected = selected.has(list.id);
                            // let label = `list-chooser-checkbox-label-${list.id}`;
                            return (
                                <ListGroup.Item key={list.id} className="d-flex justify-content-between align-items-center py-1 px-2 border-0" action onClick={isSelected ? (() => onDeselect(list.id)) : (() => onSelect(list.id))}>
                                    <span className="align-middle">{list.name}</span>
                                    {isSelected && (<FontAwesomeIcon className="align-middle ml-1 text-primary" icon={check} />)}
                                </ListGroup.Item>
                            );
                        })}
                        <ListGroup.Item className="py-1 px-2 border-0" action onClick={() => onAddList("New List")}><FontAwesomeIcon icon={plus} /> Add list</ListGroup.Item>
                    </ListGroup>
                </Popover.Content>
            </Popover>
        }>
            <Button>{selectedDescription(listMap, selected)} <FontAwesomeIcon icon={caretDown} /></Button>
        </OverlayTrigger>
    );
}