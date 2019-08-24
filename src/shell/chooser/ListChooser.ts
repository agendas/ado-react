import {connect} from "react-redux";
import ListChooserControl from "./ListChooserControl";
import {AdoAction, AdoModelOperations, AdoModelTypes, AdoState, AdoStateNamespaces} from "../../state/interfaces";
import {Dispatch} from "redux";
import uuidv4 from "uuid/v4";
import {Optional} from "../../core/utils";
import {ChooserActionType, ChooserNamespace, ChooserState} from "./interfaces";

const emptySet = new Set<string>();

function mapStateToProps(state: AdoState) {
    let chooserState = state.chooser as Optional<ChooserState>;
    return {
        lists: state.model ? Array.from(state.model.lists.values()) : [],
        selected: chooserState ? chooserState.selected : emptySet
    };
}

function mapDispatchToProps(dispatch: Dispatch<AdoAction>) {
    return {
        onAddList(name: string) {
            dispatch({
                namespace: AdoStateNamespaces.model,
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
                namespace: ChooserNamespace,
                type: ChooserActionType.select,
                id
            });
        },
        onDeselect(id: string) {
            dispatch({
                namespace: ChooserNamespace,
                type: ChooserActionType.deselect,
                id
            });
        },
        onDelete(id: string) {
            dispatch({
                namespace: AdoStateNamespaces.model,
                type: AdoModelTypes.list,
                operation: AdoModelOperations.delete,
                id,
                log: true
            });
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ListChooserControl);