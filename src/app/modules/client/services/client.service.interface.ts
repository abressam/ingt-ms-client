import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';

export interface ClientServiceInterface {
    getPatientsRDP(
        crp: string,
        startDate?: string, 
        endDate?: string, 
        emotion?: string, 
        patientId?: string
    ): Promise<GetClientResDto>;
    getMyRDP(
        patientId: string,
        startDate?: string, 
        endDate?: string, 
        emotion?: string, 
    ): Promise<GetClientResDto>;
    postRDP(patientId: string, responsibleCrp: string, body: PostClientReqDto): Promise<GetClientResDto>
    putRDP(patientId: string, body: PutClientReqDto): Promise<GetClientResDto>
    deleteRPD(patientId: string, uuid: string, clientId: string): Promise<DeleteClientResDto>
}