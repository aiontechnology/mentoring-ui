/**
 * Copyright 2020 Aion Technology LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRepository } from 'src/app/implementation/repository/base-repository';
import { ProgramAdmin } from '../../models/program-admin/program-admin';

@Injectable()
export class ProgramAdminRepositoryService extends BaseRepository<ProgramAdmin> {

  constructor(http: HttpClient) {
    super('/api/v1/schools/{id}/programAdmins', http);
  }

  createProgramAdmin(schoolId: string, programAdmin: ProgramAdmin  ): Promise<ProgramAdmin> {
    return super.create(this.buildUri(schoolId), programAdmin);
  }

  readAllProgramAdmins(schoolId: string): void {
    return super.readAll(this.buildUri(schoolId));
  }

  updateProgramAdmin(programAdmin: ProgramAdmin): Promise<ProgramAdmin> {
    return super.update(this.uriBase, programAdmin);
  }

  deleteProgramAdmins(programAdmins: ProgramAdmin[]) {
    return super.delete(programAdmins);
  }

  protected fromJSON(json: any): ProgramAdmin {
    return new ProgramAdmin(json);
  }

  protected newItem(): ProgramAdmin {
    return new ProgramAdmin();
  }

  private buildUri(schoolId: string) {
    return this.uriBase.replace('{id}', schoolId);
  }

}
