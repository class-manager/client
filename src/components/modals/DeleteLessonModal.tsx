import { Loading, Modal } from "carbon-components-react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import { makeAuthenticatedRequest } from "../../lib/api";

export interface DeleteLessonModalProps {
    lessonName: string;
    className: string;
    classID: string;
    lessonID: string;
    open: boolean;
    handleRequestClose: () => void;
}

const DeleteLessonModal: React.FC<DeleteLessonModalProps> = ({
    className,
    classID,
    lessonID,
    lessonName,
    open,
    handleRequestClose,
}) => {
    const [submitting, setSubmit] = React.useState(false);
    const history = useHistory();

    return (
        <Modal
            modalHeading={`Delete ${lessonName}?`}
            modalLabel="Lessons"
            danger
            primaryButtonText="Delete Lesson"
            primaryButtonDisabled={submitting}
            preventCloseOnClickOutside={submitting}
            open={open}
            onRequestClose={handleRequestClose}
            size="xs"
            onRequestSubmit={async () => {
                setSubmit(true);

                try {
                    const res = await makeAuthenticatedRequest(
                        "DELETE",
                        `/classes/${classID}/lessons/${lessonID}`
                    );

                    if (res.status !== 204) return setSubmit(false);

                    history.replace("/dashboard");
                } catch (error) {}
            }}
        >
            {submitting && <Loading description="One moment" withOverlay={true} small />}
            <p>Are you sure you want to delete {lessonName}?</p>
        </Modal>
    );
};

export default DeleteLessonModal;
