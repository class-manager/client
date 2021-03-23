import { Modal } from "carbon-components-react";
import { atom, useRecoilState } from "recoil";

export const RegistrationModalState = atom<boolean>({
    key: "registrationModalStateKey",
    default: false,
});
export const RegistrationModal = () => {
    const [registrationModalOpen, setRegistrationModalOpen] = useRecoilState(
        RegistrationModalState
    );

    return (
        <Modal
            open={registrationModalOpen}
            modalHeading="Register"
            modalLabel="Accounts"
            primaryButtonText="Register"
            secondaryButtonText="Cancel"
            onRequestClose={() => setRegistrationModalOpen(false)}
            size="xs"
        ></Modal>
    );
};
