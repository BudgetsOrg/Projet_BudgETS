import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget, Enveloppe } from "src/entities";
import { Not, Repository } from "typeorm";
import { CreateEnveloppeDto } from "./dto/create_enveloppe.dto";
import { UpdateEnveloppeDto } from "./dto/update_enveloppe.dto";

// @Injectable() :"C'est un outil (service) que les autres 
// classes peuvent utiliser."
@Injectable()
export class EnveloppeService{

    //Inject repository permet d'envoyer des requetes à la bd pour les tables mentionnées.
    constructor(
        @InjectRepository( Enveloppe ) 
        private enveloppeRepository: Repository<Enveloppe>,
    
        @InjectRepository(Budget) 
        private budgetRepository: Repository<Budget>
    ) {}  

    //Prend les champs du body + le user id du token en paramètre
    async create(userId: number, createEnveloppeDto: CreateEnveloppeDto) {
        //Façon TypeORM de fair des requetes à la bd. On demande pour
        //le budget le plus récent qui appartient au user authentifié et les enveloppes reliées à ce user. 
        const budget = await this.budgetRepository.findOne({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' }
        });

        if (!budget) {
            throw new NotFoundException('Aucun budget trouvé pour cet utilisateur'); 
        }

        //Une boucle qui parcourt les enveloppes du budget pour calculer le montant total
        // déjà alloué et le montant restant du budget.
        const totalAllocated = budget.enveloppes.reduce(
            (sum, env) => sum + Number(env.montant), 0,
        );
        const remainder = Number(budget.solde) - totalAllocated;

        if (Number(createEnveloppeDto.montant) > remainder) {
            throw new BadRequestException(
                `Dépasse le budget. Veuillez réduire le montant de l'enveloppe ou changer le solde du budget ou des enveloppes existantes.`
            );
        }
        //Si tout les verifications sont passées, on crée une nouvelle enveloppe avec les champs précisés.
        const enveloppe = this.enveloppeRepository.create({
            ...createEnveloppeDto, // envoie les champs du body récupérés par le DTO dans la table.
            budget: budget, // relie la table enveloppe à la table budget pour faire le lien entre les deux objets.
        });

        return this.enveloppeRepository.save(enveloppe);
    }

    async findAll(userId: number) {
        const budget = await this.budgetRepository.findOne({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' }
        });

        if (!budget) {
            throw new NotFoundException('Aucun budget trouvé pour cet utilisateur'); 
        }

        return budget.enveloppes;
    }

    async findOne(userId: number, id: number) {
        //Trouve l'eneveloppe qui correspond à l'id puis vérifie que le budget auquel
        // appartient l'eneveloppe a le même user id que celui du token. Si c'est le cas, 
        // on retourne l'enveloppe, sinon on retourne une erreur.
        const enveloppe = await this.enveloppeRepository.findOne({
            where: { id_enveloppe: id, budget: { user: { id_user: userId } } },
            relations: ['budget']
        });

        if (!enveloppe) {
            throw new NotFoundException('Enveloppe non trouvée');
        }

        return enveloppe;
    }

    async update(userId: number, updateEnveloppeDto: UpdateEnveloppeDto, id: number) {
        const enveloppe = await this.findOne(userId,id); // Utilise Findone pour get l'eneveloppe en question
        // ?? verifie si le champ a changé, si oui, il le change, sinon il garde l'ancien champ.
        enveloppe.titre = updateEnveloppeDto.titre ?? enveloppe.titre;
        enveloppe.montant = updateEnveloppeDto.montant ?? enveloppe.montant;
        enveloppe.image = updateEnveloppeDto.image ?? enveloppe.image;
        return this.enveloppeRepository.save(enveloppe);
    }

    async remove(userId: number, id: number) {
        const enveloppe = await this.findOne(userId, id);
        await this.enveloppeRepository.remove(enveloppe);
        return { message: 'Enveloppe supprimée avec succès' };
    }
}