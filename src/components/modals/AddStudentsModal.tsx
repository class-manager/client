/** @jsxImportSource @emotion/react */
import { Checkbox, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Loading, Modal } from "carbon-components-react";
import { DateTime } from "luxon";
import * as React from "react";
import { useQuery, UseQueryResult } from "react-query";
import { Link } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import { makeAuthenticatedRequest } from "../../lib/api";

export const AddStudentsModalState = atom<boolean>({
    key: "addStudentsModalStateKey",
    default: false,
});

export interface AddStudentsModalProps {
    classID: string;
    students: { id: string; name: string }[];
    query: UseQueryResult<unknown, unknown>;
}

const AddStudentsModal: React.FC<AddStudentsModalProps> = ({ classID, query, students }) => {
    const [open, setOpen] = useRecoilState(AddStudentsModalState);
    const [, setFailed] = React.useState(false);

    const studentsQuery = useQuery("all-students", async function () {
        const res = await makeAuthenticatedRequest("GET", `/students`);
        return (await res.json()) as { id: string; dob: string; graduatingClass: number; firstName: string; lastName: string }[];
    });

    const [submitting, setSubmitting] = React.useState(false);

    const [studentsList, setStudentsList] = React.useState<
        { id: string; firstName: string; lastName: string; dob: DateTime; selected: boolean }[]
    >([]);

    React.useMemo(() => {
        if (studentsQuery.data) {
            setStudentsList(
                studentsQuery.data
                    // Students who are in the class already cannot be added
                    .filter((s) => !students.map((ss) => ss.id).includes(s.id))
                    // Add the required properties to the students to the state
                    .map((s) => ({
                        ...s,
                        selected: false,
                        dob: DateTime.fromISO(s.dob),
                    }))
            );
        }
    }, [studentsQuery.data, students]);

    if (studentsQuery.isLoading) return null;

    return (
        <Modal
            open={open}
            modalLabel="Students"
            modalHeading="Add Students"
            size="sm"
            onRequestClose={() => {
                if (!submitting) {
                    setStudentsList(studentsList.map((s) => ({ ...s, selected: false })));
                    setOpen(false);
                }
            }}
            preventCloseOnClickOutside={submitting}
            primaryButtonText="Add Selected Students"
            primaryButtonDisabled={
                submitting || studentsList.filter((s) => s.selected).length === 0
            }
            secondaryButtonText="Select All Students"
            onSecondarySubmit={() =>
                setStudentsList(studentsList.map((s) => ({ ...s, selected: true })))
            }
            onRequestSubmit={async () => {
                setSubmitting(true);

                // Make DELETE request
                try {
                    const res = await makeAuthenticatedRequest(
                        "POST",
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
                You need to create students before you can add them to classes. You can do that{" "}
                <Link to="/students">here</Link>.
            </p>
            <List>
                {studentsList.map(({ id, firstName, lastName, selected, dob }) => (
                    <ListItem
                        key={id}
                        button
                        dense
                        onClick={() => {
                            setStudentsList(
                                studentsList.map((s) =>
                                    s.id === id ? { ...s, selected: !s.selected } : s
                                )
                            );
                        }}
                        disabled={submitting}
                    >
                        <ListItemIcon>
                            <Checkbox edge="start" checked={selected} disableRipple />
                        </ListItemIcon>
                        <ListItemText
                            primary={`${firstName} ${lastName}`}
                            secondary={`Born: ${dob.toLocaleString(DateTime.DATE_MED)}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Modal>
    );
};

export default AddStudentsModal;
