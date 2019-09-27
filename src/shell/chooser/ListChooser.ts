import {connect} from "react-redux";
import ListChooserControl from "./ListChooserControl";
import {AdoModelOperations, AdoModelTypes, AdoState} from "../../state/interfaces";
import {AnyAction, Dispatch} from "redux";
import uuidv4 from "uuid/v4";
import {Optional} from "../../core/utils";
import {ChooserActionType, ChooserState} from "./interfaces";

const emptySet = new Set<string>();

function mapStateToProps(state: AdoState) {
    let chooserState = state.chooser as Optional<ChooserState>;
    return {
        lists: state.model ? Array.from(state.model.lists.values()) : [],
        listMap: state.model ? state.model.lists : undefined,
        selected: chooserState ? chooserState.selected : emptySet
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
    return {
        onAddList(name: string) {
            dispatch({
                type: AdoModelTypes.list,
                operation: AdoModelOperations.add,
                list: {
                    id: uuidv4(),
                    name,
                    location: "0"
                },
                log: true
            });
        },
        onSelect(id: string) {
            dispatch({
                type: ChooserActionType.select,
                id
            });
        },
        onDeselect(id: string) {
            dispatch({
                type: ChooserActionType.deselect,
                id
            });
        },
        onDelete(id: string) {
            dispatch({
                type: AdoModelTypes.list,
                operation: AdoModelOperations.delete,
                id,
                log: true
            });
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ListChooserControl);