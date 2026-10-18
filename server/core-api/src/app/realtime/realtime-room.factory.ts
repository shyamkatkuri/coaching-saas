import {
    Injectable,
} from '@nestjs/common';

@Injectable()
export class RealtimeRoomFactory {

    user(
        applicationUserId:
            string,
    ): string {

        return (
            `user:` +
            applicationUserId
        );
    }

    organization(
        organizationId:
            string,
    ): string {

        return (
            `org:` +
            organizationId
        );
    }

    branch(
        organizationId:
            string,

        branchId:
            string,
    ): string {

        return (
            `org:` +
            organizationId +
            ':branch:' +
            branchId
        );
    }
}