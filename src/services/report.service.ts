// src/modules/search/search.repository.ts
import { Injectable } from '@nestjs/common';
import { BaseRole } from 'src/common/enum/base.role.enum';
import { AuthPayload } from 'src/common/interface/auth.interface';
import { checkHasRoles } from 'src/common/utils/check-role.util';
import { ReportRepository } from 'src/repositories/report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async reportall(user: AuthPayload) {
    const isadminOruser = checkHasRoles(user.roles, [
      BaseRole.ADMIN_HOTEL,
      BaseRole.USER_HOTEL,
    ]);

    if (isadminOruser) return this.reportRepository.reportAll(user.hotels[0].id);
    return this.reportRepository.reportAll();
  }
}
