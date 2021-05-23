/** @jsxImportSource @emotion/react */
import { Checkbox, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Loading, Modal } from "carbon-components-react";
import * as React from "react";
import { UseQueryResult } from "react-query";
import { atom, useRecoilState } from "recoil";
import { makeAuthenticatedRequest } from "../../lib/api";

export const DeleteStudentsModalState = atom<boolean>({
    key: "deleteStudentsModalStateKey",
    default: false,
});

export interface DeleteStudentsModalProps {
    classID: string;
    students: { id: string; name: string }[];
    query: UseQueryResult<unknown, unknown>;
}

const RemoveStudentsModal: React.FC<DeleteStudentsModalProps> = ({ classID, students, query }) => {
    const [open, setOpen] = useRecoilState(DeleteStudentsModalState);
    const [, setFailed] = React.useState(false);

    const [submitting, setSubmitting] = React.useState(false);

    const [studentsList, setStudentsList] = React.useState(
        students.map((s) => ({ selected: false, ...s }))
    );

    const disabled = submitting || studentsList.filter((s) => s.selected).length === 0;

    React.useEffect(() => {
        setStudentsList(students.map((s) => ({ selected: false, ...s })));
    }, [students]);

    return (
        <Modal
            open={open}
            modalLabel="Students"
            modalHeading="Select Students to Remove"
            danger
            size="sm"
            onRequestClose={() => {
                if (!submitting) {
                    setStudentsList(students.map((s) => ({ selected: false, ...s })));
                    setOpen(false);
                }
            }}
            preventCloseOnClickOutside={submitting}
            primaryButtonText="Remove Students"
            primaryButtonDisabled={disabled}
            secondaryButtonText="Select All Students"
            onSecondarySubmit={() =>
                setStudentsList(studentsList.map((s) => ({ ...s, selected: true })))
            }
            onRequestSubmit={async () => {
                setSubmitting(true);

                // Make DELETE request
                try {
                    const res = await makeAuthenticatedRequest(
                        "DELETE",
                        `/classes/${classID}/students`,
                        { students: studentsList.filter((s) => s.selected).map((s) => s.id) }
                    );

                    if (res.status !== 200) {
                        return setSubmitting(false);
                    }

                    setSubmitting(false);
                    setOpen(false);
                    query.refetch();
                } catch (error) {}
            }}
        >
            {submitting && <Loading description="One moment" withOverlay={true} small />}
            <p>
                This will remove the students from the class. The students{" "}
                <strong>will not be deleted from the system entirely</strong>, only from the class.
            </p>
            <List>
                {studentsList.map(({ id, name, selected }) => (
                    <ListItem
                        key={id}
                        button
                        dense
                        onClick={() => {
                            setStudentsList(
                                studentsList.map((e) =>
                                    e.id === id ? { ...e, selected: !e.selected } : e
                                )
                            );
                        }}
                        disabled={submitting}
                    >
                        <ListItemIcon>
                            <Checkbox edge="start" checked={selected} disableRipple />
                        </ListItemIcon>
                        <ListItemText primary={name} />
                    </ListItem>
                ))}
            </List>
        </Modal>
    );
};

export default RemoveStudentsModal;
