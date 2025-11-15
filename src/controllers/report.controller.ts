// src/modules/role/presentation/role.controller.ts
import { Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { MessageResponse } from 'src/common/enum/message.reponse.enum';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { formatResponse } from 'src/common/utils/response.util';
import { ReportService } from 'src/services/report.service';

@Controller('report')
export class ReportController {
  constructor(protected readonly roleService: ReportService) {}
  @Post('reportall')
  async reportall(@CurrentUser() user: AuthPayload) {
    return formatResponse(
      await this.roleService.reportall(user),
      MessageResponse.SUCCESS,
      200,
    );
  }
}
